class CreateRegisteredDates < ActiveRecord::Migration
  def self.up
    create_table :registered_dates do |t|
      t.column :registration_id, :integer
      t.column :start,        :datetime
      t.column :end,          :datetime
      t.column :approved_time, :datetime
    end
  end

  def self.down
    drop_table :registered_dates
  end
end
