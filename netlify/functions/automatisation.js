
exports.handler = async (event) => {
  try {
    const data = JSON.parse(event.body);

    // Simulate automation (email, CRM, etc.)
    console.log("New lead:", data);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Automation triggered successfully" })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Automation failed" })
    };
  }
};
