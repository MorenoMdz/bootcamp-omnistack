'use strict'

const User = use('App/Models/User')
const Invite = use('App/Models/Invite')

class UserController {
  async store ({ request, response, auth }) {
    const data = request.only(['name', 'email', 'password'])
    // grab the invites related to this email for future use
    const teamsQuery = Invite.query().where('email', data.email)
    // Pluck will return an array with the teams that match the team_id
    const teams = await teamsQuery.pluck('team_id')

    // if the user is not found in any team
    if (teams.length === 0) {
      return response
        .status(401)
        .send({ message: 'You are not invited to any team.' })
    }
    // else if the team is found in a team
    const user = await User.create(data)
    await user.teams().attach(teams)
    // remove the teams relation data (the invites)
    await teamsQuery.delete()

    const token = await auth.attempt(data.email, data.password)
  }
}

module.exports = UserController
