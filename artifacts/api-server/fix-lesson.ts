import "dotenv/config";
import { supabase } from "./src/lib/supabase.js";

async function fixLesson() {
  const lessonId = "144e79d5-588b-47a4-b593-91b897c3f937";
  const validYoutubeId = "aqz-KE-bpKQ"; // A valid test video

  console.log(`Fixing lesson ${lessonId}...`);
  const { error } = await supabase
    .from("lessons")
    .update({ youtube_video_id: validYoutubeId })
    .eq("id", lessonId);

  if (error) {
    console.error("Failed:", error);
  } else {
    console.log("Success! Updated youtube_video_id to", validYoutubeId);
  }
}

fixLesson();
