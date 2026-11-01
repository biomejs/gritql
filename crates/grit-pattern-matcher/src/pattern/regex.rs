use super::{
    patterns::{Matcher, Pattern, PatternName},
    resolved_pattern::ResolvedPattern,
    variable::Variable,
    State,
};
use crate::{
    binding::Binding,
    context::{ExecContext, QueryContext},
};
use core::fmt::Debug;
use grit_util::{
    error::{GritPatternError, GritResult},
    AnalysisLogs,
};
use regex::Regex;
use std::sync::OnceLock;

#[derive(Debug, Clone)]
pub struct RegexPattern<Q: QueryContext> {
    pub regex: RegexLike<Q>,
    pub variables: Vec<Variable>,
    /// Compiled forms of a static `RegexLike::Regex`, filled in on first use.
    /// Assumes `regex` is not replaced after construction.
    compiled: CompiledRegex,
}

#[derive(Debug, Clone)]
pub enum RegexLike<Q: QueryContext> {
    Regex(String),
    Pattern(Box<Pattern<Q>>),
}

impl<Q: QueryContext> RegexPattern<Q> {
    pub fn new(regex: RegexLike<Q>, variables: Vec<Variable>) -> Self {
        Self {
            regex,
            variables,
            compiled: CompiledRegex::default(),
        }
    }

    pub(crate) fn execute_matching<'a>(
        &'a self,
        binding: &Q::ResolvedPattern<'a>,
        state: &mut State<'a, Q>,
        context: &'a Q::ExecContext<'a>,
        logs: &mut AnalysisLogs,
        must_match_entire_string: bool,
    ) -> GritResult<bool> {
        let text = binding.text(&state.files, context.language())?;
        let dynamic_regex;
        let final_regex = match &self.regex {
            RegexLike::Regex(regex) => self.compiled.get(regex, must_match_entire_string)?,
            RegexLike::Pattern(ref pattern) => {
                let resolved = Q::ResolvedPattern::from_pattern(pattern, state, context, logs)?;
                let text = resolved.text(&state.files, context.language())?;
                dynamic_regex = compile(&text, must_match_entire_string)?;
                &dynamic_regex
            }
        };
        let captures = match final_regex.captures(&text) {
            Some(captures) => captures,
            None => return Ok(false),
        };

        // todo: make sure the entire string is matched

        if captures.len() != self.variables.len() + 1 {
            return Err(GritPatternError::new(format!(
                "regex pattern matched {} variables, but expected {}",
                captures.len() - 1,
                self.variables.len()
            )));
        }
        // why not zip?
        for (i, variable) in self.variables.iter().enumerate() {
            let value = captures
                .get(i + 1)
                .ok_or_else(|| GritPatternError::new("missing capture group"))?;

            let range = value.range();
            let value = value.as_str();

            // we should really be making the resolved pattern first, and using
            // variable execute, instead of reimplementing here.
            let variable_content = &mut state.bindings[variable.try_scope().unwrap() as usize]
                .last_mut()
                .unwrap()[variable.try_index().unwrap() as usize];

            if let Some(previous_value) = &variable_content.value {
                if previous_value
                    .text(&state.files, context.language())
                    .unwrap()
                    != value
                {
                    return Ok(false);
                } else {
                    continue;
                }
            } else {
                let res = if let Some((Some(mut byte_range), Some(source))) = binding
                    .get_last_binding()
                    .map(|binding| (binding.range(context.language()), binding.source()))
                {
                    byte_range.end = byte_range.start + range.end;
                    byte_range.start += range.start;
                    Q::ResolvedPattern::from_range_binding(byte_range, source)
                } else {
                    Q::ResolvedPattern::from_string(value.to_string())
                };
                if let Some(pattern) = variable_content.pattern {
                    if !pattern.execute(&res, state, context, logs)? {
                        return Ok(false);
                    }
                }
                let variable_content = &mut state.bindings[variable.try_scope().unwrap() as usize]
                    .last_mut()
                    .unwrap()[variable.try_index().unwrap() as usize];
                variable_content.set_value(res);
            }
        }

        Ok(true)
    }
}

#[derive(Debug, Clone, Default)]
struct CompiledRegex {
    anchored: OnceLock<Regex>,
    unanchored: OnceLock<Regex>,
}

impl CompiledRegex {
    /// Returns the cached regex for `source`, compiling it on first use.
    /// Compilation errors are returned (and retried on the next call) rather
    /// than cached.
    fn get(&self, source: &str, must_match_entire_string: bool) -> GritResult<&Regex> {
        let cell = match must_match_entire_string {
            true => &self.anchored,
            false => &self.unanchored,
        };
        if let Some(regex) = cell.get() {
            return Ok(regex);
        }
        let regex = compile(source, must_match_entire_string)?;
        Ok(cell.get_or_init(|| regex))
    }
}

fn compile(source: &str, must_match_entire_string: bool) -> GritResult<Regex> {
    let regex = match must_match_entire_string {
        true => Regex::new(&format!("^{}$", source))?,
        false => Regex::new(source)?,
    };
    Ok(regex)
}

impl<Q: QueryContext> PatternName for RegexPattern<Q> {
    fn name(&self) -> &'static str {
        "REGEX"
    }
}

impl<Q: QueryContext> Matcher<Q> for RegexPattern<Q> {
    fn execute<'a>(
        &'a self,
        binding: &Q::ResolvedPattern<'a>,
        state: &mut State<'a, Q>,
        context: &'a Q::ExecContext<'a>,
        logs: &mut AnalysisLogs,
    ) -> GritResult<bool> {
        self.execute_matching(binding, state, context, logs, true)
    }
}

#[cfg(test)]
mod tests {
    use super::CompiledRegex;

    #[test]
    fn caches_anchored_and_unanchored_separately() {
        let compiled = CompiledRegex::default();

        let anchored = compiled.get("a+", true).unwrap();
        assert_eq!(anchored.as_str(), "^a+$");
        assert!(anchored.is_match("aaa"));
        assert!(!anchored.is_match("baaa"));

        let unanchored = compiled.get("a+", false).unwrap();
        assert_eq!(unanchored.as_str(), "a+");
        assert!(unanchored.is_match("baaa"));

        // Subsequent lookups return the cached instances.
        assert!(std::ptr::eq(anchored, compiled.get("a+", true).unwrap()));
        assert!(std::ptr::eq(unanchored, compiled.get("a+", false).unwrap()));
    }

    #[test]
    fn invalid_regex_is_an_error() {
        let compiled = CompiledRegex::default();
        assert!(compiled.get("(", true).is_err());
        assert!(compiled.get("(", false).is_err());
        // Errors are not cached, so a retry still reports the error.
        assert!(compiled.get("(", true).is_err());
    }
}
