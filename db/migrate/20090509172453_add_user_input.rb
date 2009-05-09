class AddUserInput < ActiveRecord::Migration
  def self.up
    add_column :weekly_availablities, :user_input, :text, :default => ""
  end

  def self.down
    remove_column :weekly_availablities, :user_input
  end
end
