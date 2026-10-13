type UserGreetingProps = {
  isLoggedIn: boolean;
  username: string;
}

function UserGreeting({isLoggedIn = false, username = "Guest"}: UserGreetingProps) {
  const welcomeStyles = {
      color: "green",
      backgroundColor: "#e7f4e7",
      padding: "50px",
      borderRadius: "5px",
    };

    const loginStyles = {
      color: "#c9302c",
      backgroundColor: "#fbe9e9",
      padding: "10px",
      borderRadius: "5px",
    };

  return (
    <h2 style={isLoggedIn ? welcomeStyles : loginStyles}>
      {isLoggedIn
        ? `Welcome ${username}`
        : "Please login to continue"}
    </h2>
    );
}

export default UserGreeting