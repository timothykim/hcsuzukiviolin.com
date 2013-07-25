class AddLessonCountDateToSession < ActiveRecord::Migration
  def self.up
    add_column :sessions, :lesson_count, :integer
    add_column :sessions, :group_count, :integer
  end

  def self.down
    remove_column :sessions, :group_count
    remove_column :sessions, :lesson_count
  end
end
