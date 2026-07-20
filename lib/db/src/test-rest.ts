async function check() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Missing keys");

  const res = await fetch(`${url}/rest/v1/courses?select=*&limit=1`, {
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`
    }
  });

  console.log("Status:", res.status);
  const data = await res.json();
  console.log("Data:", data);
}
check();
