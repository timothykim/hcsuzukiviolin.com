class CreateRegistrations < ActiveRecord::Migration
  def self.up
    create_table :registrations do |t|
      t.column :student_id, :integer
      t.column :school_id, :integer
      t.column :user_id, :integer
      t.column :session_id, :integer
      t.column :lesson_duration, :integer
      t.timestamps
    end
  end

  def self.down
    drop_table :registrations
  end
end
