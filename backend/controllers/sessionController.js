const supabase = require("../data");

exports.bulkSaveSession = async (req, res) => {
  const userId = req.userId;
  const { 
    startedAt, 
    endedAt, 
    interruptionCount
  } = req.body;

  const { data, error } = await supabase
    .from("sessions")
    .insert([
      {
        user_id: userId,
        start_time: new Date(startedAt),
        end_time: new Date(endedAt),
        interruptions: interruptionCount
      }
    ])
    .select()
    .single();

  if (error) {
    console.error("Supabase Error:", error);
    return res.status(400).json({ message: error.message });
  }
  res.json({ message: "Session saved", session: data });
};