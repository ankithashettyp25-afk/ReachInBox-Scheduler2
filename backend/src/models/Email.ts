import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/db';

export class Email extends Model {
  public id!: string;
  public idempotencyKey!: string;
  public senderEmail!: string;
  public recipientEmail!: string;
  public subject!: string;
  public body!: string;
  public status!: 'SCHEDULED' | 'SENT' | 'FAILED' | 'RATE_LIMITED';
  public scheduledAt!: Date;
  public sentAt?: Date;
  public delayBetweenMs!: number;
  public hourlyLimit!: number;
  public slackWebhookUrl?: string;
  public errorMessage?: string;
  public readonly createdAt!: Date;
   public readonly updatedAt!: Date;
}

Email.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    idempotencyKey: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    senderEmail: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    recipientEmail: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    subject: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    body: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('SCHEDULED', 'SENT', 'FAILED', 'RATE_LIMITED'),
      defaultValue: 'SCHEDULED',
    },
    scheduledAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    sentAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    delayBetweenMs: {
      type: DataTypes.INTEGER,
      defaultValue: 2000,
    },
    hourlyLimit: {
      type: DataTypes.INTEGER,
      defaultValue: 200,
    },
    slackWebhookUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    errorMessage: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'emails',
    timestamps: true,
  }
);