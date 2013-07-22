class AddLessonLocation < ActiveRecord::Migration
  def self.up
    add_column :lessons, :location_id, :integer
  end

  def self.down
    remove_column :lessons, :location_id
  end
end
