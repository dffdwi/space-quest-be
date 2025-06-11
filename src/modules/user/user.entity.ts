import {
  Table,
  Column,
  Model,
  DataType,
  BeforeCreate,
  PrimaryKey,
  Default,
} from 'sequelize-typescript';
import * as bcrypt from 'bcrypt';

@Table({
  tableName: 'users',
  timestamps: true,
})
export class User extends Model<User> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column({
    type: DataType.UUID,
    field: 'userId',
  })
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

  @BeforeCreate
  static async hashPassword(instance: User) {
    if (instance.password) {
      const salt = await bcrypt.genSalt(10);
      instance.password = await bcrypt.hash(instance.password, salt);
    }
  }

  async comparePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }
}
