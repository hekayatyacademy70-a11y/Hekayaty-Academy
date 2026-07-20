import { supabase } from "./lib/supabase";

async function migrate() {
  const { error } = await supabase.rpc("exec_sql" as any, {
    sql: "ALTER TABLE courses ADD COLUMN IF NOT EXISTS category TEXT;"
  });

  if (error) {
    // Try direct query instead
    const res = await fetch(`${process.env.SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "apikey": process.env.SUPABASE_SERVICE_ROLE_KEY || "",
        "Authorization": `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY || ""}`,
      },
      body: JSON.stringify({ sql: "ALTER TABLE courses ADD COLUMN IF NOT EXISTS category TEXT;" })
    });
    console.log("RPC result:", res.status, await res.text());
  } else {
    console.log("Migration complete!");
  }
}

migrate().catch(console.error);
