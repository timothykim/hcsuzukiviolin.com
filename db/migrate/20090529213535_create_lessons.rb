class CreateLessons < ActiveRecord::Migration
  def self.up
    create_table :lessons do |t|
      t.column :registration_id, :integer
      t.column :time, :datetime, :default => nil
      t.column :is_recurring, :boolean
      t.column :duration, :integer
    end
  end

  def self.down
    drop_table :lessons
  end
end
