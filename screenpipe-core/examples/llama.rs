use anyhow::Result;

#[cfg(feature = "llm")]
fn main() -> Result<()> {
    use skyprompt_core::LLM;

    let llm = LLM::new(skyprompt_core::ModelName::Llama)?;

    let res = llm.chat(skyprompt_core::ChatRequest {
        messages: vec![skyprompt_core::ChatMessage {
            role: "user".to_string(),
            content: "What is the meaning of life?".to_string(),
        }],
        temperature: None,
        top_k: None,
        top_p: None,
        max_completion_tokens: None,
        seed: None,
        stream: false,
    })?;

    println!("{:?}", res.choices[0].message.content);

    println!("{:?}", res.usage.tokens_per_second);
    Ok(())
}

#[cfg(not(feature = "llm"))]
fn main() -> Result<()> {
    println!("LLM feature is not enabled");
    Ok(())
}
