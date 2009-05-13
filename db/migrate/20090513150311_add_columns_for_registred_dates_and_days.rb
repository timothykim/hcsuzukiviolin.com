class AddColumnsForRegistredDatesAndDays < ActiveRecord::Migration
  def self.up
    remove_column :registered_dates, :approved_time
    remove_column :registered_days, :approved_time
    remove_column :registrations, :user_id
    add_column :registered_dates, :preferred, :boolean, :default => false
    add_column :registered_days, :preferred, :boolean, :default => false
  end

  def self.down
    add_column :registered_dates, :approved_time, :datetime
    add_column :registered_days, :approved_time, :time
    add_column :registrations, :user_id, :integer
    remove_column :registered_dates, :preferred
    remove_column :registered_days, :preferred
  end
end
