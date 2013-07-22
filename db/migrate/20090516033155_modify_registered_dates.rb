class ModifyRegisteredDates < ActiveRecord::Migration
  def self.up
    change_column :registered_dates, :start, :time
    change_column :registered_dates, :end, :time
    add_column :registered_dates, :date, :date
  end

  def self.down
    change_column :registered_dates, :start, :datetime
    change_column :registered_dates, :end, :datetime
    remove_column :registered_dates, :date
  end
end
