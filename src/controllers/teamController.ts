import { Request, Response } from 'express';
import Team from '../models/Team';

export const getTeamById = async (req: Request, res: Response) => {
  const teamId = req.params.id;
  const team = await Team.findById(teamId);

  if (!team) {
    res.status(404).json({ message: "Team not found" });
    return ;
  }

  res.json(team);
};

export const updateTeamWalletAndShares = async (teamId: number, amount: number, shares: number) => {
  const team = await Team.findById(teamId);

  if (!team) {
    throw new Error('Team not found');
  }

  team.wallet -= amount;
  team.availableShares += shares;

  await team.save();
};

export const createTeam = async (req: Request, res: Response) => {
  try {
    const { name, wallet, availableShares } = req.body;

    // Validate request body
    if (!name || wallet === undefined || availableShares === undefined) {
      res.status(400).json({
        success: false,
        message: 'Missing required fields: name, wallet, and availableShares are mandatory.',
      });
      return ;
    }

    const newTeam = new Team({ name, wallet, availableShares });
    await newTeam.save();

    res.status(201).json({ success: true, data: newTeam });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create team',
      error,
    });
  }
};

