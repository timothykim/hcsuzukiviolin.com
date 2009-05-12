class AddColumnRegisteredDates < ActiveRecord::Migration
  def self.up
    add_column :registered_dates, :user_input, :text, :default => ""
    add_column :registered_days, :user_input, :text, :default => ""
  end

  def self.down
    remove_column :registered_dates, :user_input
    remove_column :registered_days, :user_input
  end
end
