import {
  Table,
  Column,
  Model,
  DataType,
  BeforeCreate,
  PrimaryKey,
  Default,
  HasMany,
  BelongsToMany,
  HasOne,
  BeforeUpdate,
} from 'sequelize-typescript';
import * as bcrypt from 'bcrypt';
import { Task } from '../task/task.entity';
import { Project } from '../project/project.entity';
import { ProjectMember } from '../project/project_member.entity';
import { Mission } from '../mission/mission.entity';
import { PlayerMission } from '../mission/player_mission.entity';
import { Badge } from '../badge/badge.entity';
import { PlayerBadge } from '../badge/player_badge.entity';
import { ShopItem } from '../shop/shop_item.entity';
import { PlayerInventory } from '../shop/player_inventory.entity';
import { PlayerStats } from './player_stats.entity';
import { ProjectInvitation } from '../project/project_invitation.entity';
import { PlayerActivePowerUp } from '../shop/player_active_powerup.entity';

@Table({
  tableName: 'users',
  timestamps: true,
})
export class User extends Model<User> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  userId!: string;

  @Column(DataType.STRING)
  name!: string;

  @Column({
    type: DataType.STRING,
    unique: true,
    allowNull: false,
  })
  email!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  password!: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
    field: 'avatar_url',
  })
  avatarUrl?: string;

  @Default(1)
  @Column(DataType.INTEGER)
  level!: number;

  @Default(0)
  @Column(DataType.INTEGER)
  xp!: number;

  @Default(100)
  @Column(DataType.INTEGER)
  credits!: number;

  @Default('theme-dark')
  @Column({
    type: DataType.STRING,
    field: 'active_theme',
  })
  activeTheme!: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
    field: 'active_avatar_frame_id',
  })
  activeAvatarFrameId?: string;

  @Column({
    type: DataType.DATE,
    allowNull: true,
    field: 'last_login_date',
  })
  lastLoginDate?: Date;

  @Default(0)
  @Column({
    type: DataType.INTEGER,
    field: 'login_streak',
  })
  loginStreak!: number;

  @Column({
    type: DataType.DATE,
    allowNull: true,
    field: 'last_discovery_date',
  })
  lastDiscoveryDate?: Date;

  @HasMany(() => Task)
  tasks!: Task[];

  @BelongsToMany(() => Project, () => ProjectMember)
  projects!: Project[];

  @BelongsToMany(() => Mission, () => PlayerMission)
  missions!: Mission[];

  @BelongsToMany(() => Badge, () => PlayerBadge)
  badges!: Badge[];

  @HasOne(() => PlayerStats)
  stats!: PlayerStats;

  @HasMany(() => PlayerInventory, 'userId')
  inventory!: PlayerInventory[];

  @HasMany(() => ProjectInvitation, 'inviterId')
  sentInvitations!: ProjectInvitation[];

  @HasMany(() => ProjectInvitation, 'inviteeId')
  receivedInvitations!: ProjectInvitation[];

  @HasMany(() => PlayerActivePowerUp, 'userId')
  activePowerUps!: PlayerActivePowerUp[];

  @BeforeCreate
  @BeforeUpdate
  static async hashPassword(instance: User) {
    if (instance.changed('password')) {
      if (instance.password) {
        const saltRounds = 10;
        instance.password = await bcrypt.hash(instance.password, saltRounds);
      }
    }
  }

  async comparePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }
}
