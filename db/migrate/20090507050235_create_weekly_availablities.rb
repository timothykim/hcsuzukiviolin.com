class CreateWeeklyAvailablities < ActiveRecord::Migration
  def self.up
    create_table :weekly_availablities do |t|
      t.column :session_id,   :integer
      t.column :school_id,    :integer
      
      t.column :day,          :integer #day of the week, 0 = sunday, 1 = monday, ...
      t.column :start,        :time
      t.column :end,          :time
    end
  end

  def self.down
    drop_table :weekly_availablities
  end
end
