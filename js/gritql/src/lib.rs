#[macro_use]
extern crate napi_derive;

mod binding;
mod search;

pub use search::QueryBuilder;
