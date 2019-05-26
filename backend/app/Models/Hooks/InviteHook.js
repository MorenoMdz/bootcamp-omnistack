'use strict'

const User = use('App/Models/User')
const Kue = use('Kue')
const Job = use('App/Jobs/InvitationEmail')

const InviteHook = (exports = module.exports = {})

InviteHook.sendInvitationEmail = async invite => {
  const { email } = invite
  // see if there is an user with that email
  const invited = await User.findBy('email', email)
  // if the user is invited then add the team to the user's teams
  if (invited) {
    await invited.teams().attach(invite.team_id)
  } else {
    // if he does not have an account create it
    const user = await invite.user().fetch()
    const team = await invite.team().fetch()

    Kue.dispatch(Job.key, { user, team, email }, { attempts: 3 })
  }
}
