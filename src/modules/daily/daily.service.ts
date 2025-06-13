import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from '../user/user.entity';
import { Sequelize } from 'sequelize-typescript';
import { Op } from 'sequelize';

@Injectable()
export class DailyService {
  constructor(
    @InjectModel(User)
    private readonly userModel: typeof User,
    private sequelize: Sequelize,
  ) {}

  private isSameDay(date1: Date, date2: Date): boolean {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  }

  async processCheckIn(userId: string) {
    return await this.sequelize.transaction(async (tx) => {
      const user = await this.userModel.findByPk(userId, {
        transaction: tx,
        lock: tx.LOCK.UPDATE,
      });
      const today = new Date();

      if (user.lastLoginDate && this.isSameDay(user.lastLoginDate, today)) {
        throw new BadRequestException(
          'Bonus login harian sudah diklaim hari ini.',
        );
      }

      const yesterday = new Date();
      yesterday.setDate(today.getDate() - 1);

      const isContinuingStreak =
        user.lastLoginDate && this.isSameDay(user.lastLoginDate, yesterday);

      const newStreak = isContinuingStreak ? user.loginStreak + 1 : 1;
      const bonusXp = 10 + newStreak * 5;
      const bonusCredits = 5 + newStreak * 2;

      user.loginStreak = newStreak;
      user.lastLoginDate = today;
      user.xp += bonusXp;
      user.credits += bonusCredits;

      await user.save({ transaction: tx });

      return {
        message: `Check-in berhasil! Streak: ${newStreak} hari.`,
        bonusXp,
        bonusCredits,
        user,
      };
    });
  }

  async claimDailyDiscovery(userId: string) {
    const user = await this.userModel.findByPk(userId);
    const today = new Date();

    if (
      user.lastDiscoveryDate &&
      this.isSameDay(user.lastDiscoveryDate, today)
    ) {
      throw new BadRequestException('Supply drop sudah diklaim hari ini.');
    }

    const rewardCredits = Math.floor(Math.random() * 20) + 10;
    const rewardXp = Math.floor(Math.random() * 25) + 15;

    user.credits += rewardCredits;
    user.xp += rewardXp;
    user.lastDiscoveryDate = today;

    await user.save();

    return {
      message: 'Supply drop berhasil didapatkan!',
      rewardCredits,
      rewardXp,
    };
  }
}
