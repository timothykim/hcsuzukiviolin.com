class CreateRegisteredDays < ActiveRecord::Migration
  def self.up
    create_table :registered_days do |t|
      t.column :registration_id, :integer
      t.column :day,          :integer #day of the week
      t.column :start,        :time
      t.column :end,          :time
      t.column :approved_time, :time
    end
  end

  def self.down
    drop_table :registered_days
  end
end
