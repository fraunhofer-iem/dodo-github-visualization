import withSession from "../../lib/api/session"

export default withSession(async (req, res) => {
  const { username, password } = await req.body
  console.log(`login request from ${username} with password ${password}`)
  try {
    const user = { name: username, admin: true, id: "1234" }
    // we check that the user exists on GitHub and store some data in session
    // const { login, avatar_url: avatarUrl } = await fetchJson(url)
    // const user = { isLoggedIn: true, login, avatarUrl }
    req.session.set("user", user)
    await req.session.save()
    res.json(user)
  } catch (error: any) {
    res.status(500).json(error)
  }
})
