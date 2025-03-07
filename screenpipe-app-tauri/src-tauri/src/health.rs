use anyhow::Result;
use serde::Deserialize;
use tauri::{path::BaseDirectory, Manager};
use tokio::time::{interval, Duration};

#[derive(Debug, Deserialize)]
#[allow(dead_code)]
struct HealthCheckResponse {
    status: String,
    #[serde(rename = "last_frame_timestamp")]
    last_frame_timestamp: Option<String>,
    #[serde(rename = "last_audio_timestamp")]
    last_audio_timestamp: Option<String>,
    #[serde(rename = "last_ui_timestamp")]
    last_ui_timestamp: Option<String>,
    frame_status: String,
    audio_status: String,
    ui_status: String,
    message: String,
    #[serde(rename = "verbose_instructions")]
    verbose_instructions: Option<String>,
}

pub async fn start_health_check(app: tauri::AppHandle) -> Result<()> {
    let mut interval = interval(Duration::from_secs(1));
    let client = reqwest::Client::new();
    let mut last_status = String::new();

    tokio::spawn(async move {
        loop {
            interval.tick().await;

            match check_health(&client).await {
                Ok(health) => {
                    let current_status = if health.status == "unhealthy" || health.status == "error"
                    {
                        "unhealthy"
                    } else {
                        "healthy"
                    };

                    if current_status != last_status {
                        last_status = current_status.to_string();
                        if let Some(main_tray) = app.tray_by_id("skyprompt_main") {
                            let icon_path = if current_status == "unhealthy" {
                                app.path()
                                    .resolve(
                                        "assets/skyprompt-logo-tray-failed.png",
                                        BaseDirectory::Resource,
                                    )
                                    .expect("failed to resolve icon path")
                            } else {
                                app.path()
                                    .resolve(
                                        "assets/skyprompt-logo-tray-black.png",
                                        BaseDirectory::Resource,
                                    )
                                    .expect("failed to resolve icon path")
                            };
                            let _ = main_tray
                                .set_icon(Some(tauri::image::Image::from_path(&icon_path).unwrap()))
                                .and_then(|_| main_tray.set_icon_as_template(true));
                        }
                    }
                }
                Err(e) => {
                    if last_status != "error" {
                        println!("health check failed: {}", e);
                        last_status = "error".to_string();
                        if let Some(main_tray) = app.tray_by_id("skyprompt_main") {
                            let icon_path = app
                                .path()
                                .resolve(
                                    "assets/skyprompt-logo-tray-failed.png",
                                    BaseDirectory::Resource,
                                )
                                .expect("failed to resolve icon path");
                            let _ = main_tray
                                .set_icon(Some(tauri::image::Image::from_path(&icon_path).unwrap()))
                                .and_then(|_| main_tray.set_icon_as_template(true));
                        }
                    }
                }
            }
        }
    });

    Ok(())
}

async fn check_health(client: &reqwest::Client) -> Result<HealthCheckResponse> {
    let response = client
        .get("http://localhost:3030/health")
        .header("Cache-Control", "no-cache")
        .header("Pragma", "no-cache")
        .timeout(Duration::from_secs(5)) // on windows it never times out
        .send()
        .await?;

    if !response.status().is_success() {
        anyhow::bail!("health check failed with status: {}", response.status());
    }

    let health = response.json::<HealthCheckResponse>().await?;
    Ok(health)
}
