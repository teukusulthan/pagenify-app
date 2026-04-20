import "dotenv/config";
import { generateWithTier } from "../src/lib/services/llm.service";

const SAMPLE_INPUT = {
  title: "Test Product",
  description: "A simple test product for debugging",
  targetAudience: "Developers",
  priceDisplay: "$29",
  keyFeatures: ["Feature one", "Feature two"],
  uniqueSellingPoints: ["USP one", "USP two"],
  productImageUrl: null,
};

(async () => {
  console.log("Testing medium tier — inspecting raw output…");
  const html = await generateWithTier(SAMPLE_INPUT, "medium");

  const styleTagCount = (html.match(/<style/gi) ?? []).length;
  const hasStyleContent = /<style[^>]*>[\s\S]{100,}<\/style>/i.test(html);
  const htmlLength = html.length;
  const startsWithDoctype = html.trimStart().startsWith("<!DOCTYPE");

  console.log(`Length: ${htmlLength} chars`);
  console.log(`Starts with DOCTYPE: ${startsWithDoctype}`);
  console.log(`<style> tag count: ${styleTagCount}`);
  console.log(`Has substantial style content: ${hasStyleContent}`);

  // Show the first 500 chars and anything around <style>
  console.log("\n--- First 500 chars ---");
  console.log(html.slice(0, 500));

  const styleIdx = html.indexOf("<style");
  if (styleIdx !== -1) {
    console.log(`\n--- <style> starts at index ${styleIdx} ---`);
    console.log(html.slice(styleIdx, styleIdx + 300));
  } else {
    console.log("\n!!! No <style> tag found in output !!!");
    // Check if it's wrapped in something
    console.log("\n--- Full output (first 2000 chars) ---");
    console.log(html.slice(0, 2000));
  }
})();
