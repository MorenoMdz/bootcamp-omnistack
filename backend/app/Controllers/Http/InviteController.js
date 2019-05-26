'use strict'

const Invite = use('App/Models/Invite')

class InviteController {
  async store ({ request, auth }) {
    /**
     * get the emails array from the request,
     * add the current logged user id to the user id info
     * add the team id which was set in the Team middleware
     */

    console.log('from Invite Controller')
    const invites = request.input('invites')
    const data = invites.map(email => ({
      email,
      user_id: auth.user.id,
      team_id: request.team.id
    }))
    await Invite.createMany(data)
  }
}

module.exports = InviteController
