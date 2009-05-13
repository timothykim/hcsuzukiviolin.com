class AddColumnRegistration < ActiveRecord::Migration
  def self.up
    add_column :registrations, :confirmed, :boolean, :default => false
    add_column :sessions, :due_date, :date
  end

  def self.down
    remove_column :registrations, :confirmed
    remove_column :sessions, :due_date
  end
end
