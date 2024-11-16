async function githubActivity(username) {
    const response = await fetch(
        `https://api.github.com/users/${username}/events`,
        {
            headers: {
                "User-Agent": "node.js",
            },
        }
    );
    if (!response.ok) {
        if (response.status === 404) {
            throw new Error("Username not found. Check username again!");
        } else {
            throw new Error("Error fetching data: ", response.status);
        }
    }
    return response.json();
}

function displayActivity(events) {
    if (events.length === 0) {
        console.log("No recent activity found");
        return;
    }

    events.forEach((event) => {
        let action;
        switch (event.type) {
            case "PushEvent":
                const commitCount = event.payload.commits.length;
                action = `Pushed ${commitCount} commit(s) to ${event.repo.name} on ${new Date(event.created_at).toLocaleDateString("en-US", 
                    { 
                        weekday: "long", 
                        year: "numeric", 
                        month: "long", 
                        day: "numeric" })} at ${new Date(event.created_at).toLocaleTimeString("en-US", 
                            { 
                                hour: "2-digit", 
                                minute: "2-digit", 
                                hour12: true })}`;
                break;
            case "CreateEvent":
                action = `Created ${event.payload.ref_type} in ${event.repo.name}`;
                break;
            default:
                action = `${event.type.replace("Event", "")} in ${
                    event.repo.name
                }`;
                break;
        }
        console.log(`- ${action}`);
    });
}

const username = process.argv[2];
if (!username) {
    console.error("Please provide a GitHub username.");
    process.exit(1);
}

githubActivity(username)
    .then((events) => {
        displayActivity(events);
    })
    .catch((error) => {
        console.error(error.message);
        process.exit(1);
    });
