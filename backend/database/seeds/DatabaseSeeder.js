'use strict'

const User = use('App/Models/User')
const Role = use('Adonis/Acl/Role')
const Permission = use('Adonis/Acl/Permission')

class DatabaseSeeder {
  async run () {
    const user = await User.create({
      name: 'User 1',
      email: 'user2@gmail.com',
      password: '123'
    })

    const createInvite = await Permission.create({
      slug: 'invites_create',
      name: 'Convidar membros'
    })

    const createProject = await Permission.create({
      slug: 'projects_create',
      name: 'Criar projetos'
    })

    const admin = await Role.create({
      slug: 'administrator',
      name: 'Admin'
    })

    const moderator = await Role.create({
      slug: 'moderator',
      name: 'Mod'
    })

    await Role.create({
      slug: 'visitor',
      name: 'Guest'
    })

    await admin.permissions().attach([createInvite.id, createProject.id])
    await moderator.permissions().attach([createProject.id])

    const team = await user.teams().create({
      name: 'Rocketseat',
      user_id: user.id
    })

    const teamJoin = await user
      .teamJoins()
      .where('team_id', team.id)
      .first()

    await teamJoin.roles().attach([admin.id])
  }
}

module.exports = DatabaseSeeder
