mod add;
mod auto_destruct;
pub mod chunking;
pub mod cli;
pub mod core;
pub mod db;
pub mod db_types;
pub mod embedding;
pub mod filtering;
pub mod migration_worker;
pub mod pipe_manager;
mod resource_monitor;
mod server;
pub mod text_embeds;
mod video;
pub mod video_cache;
mod video_db;
pub mod video_utils;
pub use add::handle_index_command;
pub use auto_destruct::watch_pid;
pub use axum::Json as JsonResponse;
pub use cli::Cli;
pub use core::start_continuous_recording;
pub use db::DatabaseManager;
pub use migration_worker::{
    create_migration_worker, MigrationCommand, MigrationConfig, MigrationResponse, MigrationStatus,
    MigrationWorker,
};
pub use pipe_manager::PipeManager;
pub use resource_monitor::{ResourceMonitor, RestartSignal};
pub use skyprompt_core::Language;
pub use server::health_check;
pub use server::AppState;
pub use server::ContentItem;
pub use server::HealthCheckResponse;
pub use server::PaginatedResponse;
pub use server::SCServer;
pub use server::{api_list_monitors, MonitorInfo};
pub use video::VideoCapture;
