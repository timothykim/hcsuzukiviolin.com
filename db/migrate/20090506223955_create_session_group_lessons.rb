class CreateSessionGroupLessons < ActiveRecord::Migration
  def self.up
    create_table :session_group_lessons do |t|
      t.column :session_id,   :integer
      t.column :day,          :date
    end
  end

  def self.down
    drop_table :session_group_lessons
  end
end
