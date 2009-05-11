class AddColumnSession < ActiveRecord::Migration
  def self.up
    add_column :sessions, :registration_type, :integer #0 = per day of the week, 1 = per date
  end

  def self.down
    remove_column :sessions, :registration_type
  end
end
