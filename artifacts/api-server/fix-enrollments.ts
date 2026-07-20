import "dotenv/config";
import { supabase } from "./src/lib/supabase.js";

async function fixMissingEnrollments() {
  console.log("Looking for missing enrollments...");
  
  // Get all completed purchase requests
  const { data: requests, error: reqErr } = await supabase
    .from("purchase_requests")
    .select("*")
    .eq("status", "completed");
    
  if (reqErr) {
    console.error("Error fetching requests", reqErr);
    return;
  }
  
  let fixed = 0;
  for (const req of requests) {
    // Check if enrollment exists
    const { data: existing } = await supabase
      .from("enrollments")
      .select("id")
      .eq("user_id", req.student_id)
      .eq("course_id", req.course_id)
      .single();
      
    if (!existing) {
      console.log(`Fixing missing enrollment for user ${req.student_id} in course ${req.course_id}`);
      const { error: insErr } = await supabase.from("enrollments").insert({
        user_id: req.student_id,
        course_id: req.course_id,
        status: "active"
      });
      if (insErr) {
        console.error("Failed to insert", insErr);
      } else {
        fixed++;
      }
    }
  }
  
  console.log(`Finished. Fixed ${fixed} enrollments.`);
}

fixMissingEnrollments();
