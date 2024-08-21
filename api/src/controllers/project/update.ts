import { Response } from "express";
import models from '../../../models'
import { requestIsValid } from '../../libs'
import { sendMail } from '../../libs/mail'
import { get, omit } from "lodash";
import { validate } from "email-validator";
import dotenv from 'dotenv'
import { generateAuthToken } from "../../libs";
import { RequestCustom } from "../../../types";

dotenv.config()

export default async (req: RequestCustom, res: Response) => {
  try {
    const data = get(req, 'body.data', null)
    const id = get(req, 'params.id', null)

    // Sanity check
    if ( !id || !requestIsValid(omit(data, ['tasks', 'members', '__v'])) )
      throw new Error('One or more parameters are missing')
    
    const { name, members } = data
    const project = await models.Project.findById(id)
    if ( !project )
      throw new Error('Project not found')

    for (const newMember of members) {
      if ( newMember && !validate(newMember) )
        throw new Error('Email address is not valid')

      const memberExist = project.members.find(existingMember => existingMember === newMember)
      if ( memberExist )
        throw new Error('Member already exist')

      await sendMail({
        recipient: newMember,
        subject: 'Invitation',
        html: `
          <p>You have been invited to join a project</p>
          <p>Project to join: <b>@Taskly/${ name }<b></p>
          <a href="${ process.env.PROJECT_JOIN_REDIRECT_URL }/projects/join?=${generateAuthToken({ email: newMember }, '24h')}" target="_blank">
            Accept invitation
          </a>
        `
      })
    }

    project.members = [ ...project.members, ...members ]
    await project.save()

    res.status(200).end()
  } catch (error) {
    res.status(500).send(get(error, 'message', 'Could not update project'))
  }
}