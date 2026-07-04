const express = require("express");
const OpenAI = require("openai");
const hiteshPrompt = require("../prompts/hitesh");
const piyushPrompt = require("../prompts/piyush");

const router = express.Router();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

router.post("/", async (req, res) => {
  try {
    const { persona, messages } = req.body;

    const systemPrompt = persona === "piyush" ? piyushPrompt : hiteshPrompt;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "system", content: systemPrompt }, ...messages],
    });

    const reply = completion.choices[0].message.content;
    res.json({ reply });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
});

module.exports = router;
