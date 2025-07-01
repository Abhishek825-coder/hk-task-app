const { Model } = require('objection');

class Task extends Model {
  static get tableName() {
    return 'tasks';
  }

  static get idColumn() {
    return 'id';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['user_id', 'name', 'status'],

      properties: {
        id: { type: 'integer' },
        user_id: { type: 'integer' },
        name: { type: 'string' },
        status: { type: 'string' }
      }
    };
  }

  static get relationMappings() {
    const User = require('./user');
    return {
      user: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: 'tasks.user_id',
          to: 'users.id'
        }
      }
    };
  }
}

module.exports = Task;
