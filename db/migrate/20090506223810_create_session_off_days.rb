class CreateSessionOffDays < ActiveRecord::Migration
  def self.up
    create_table :session_off_days do |t|
      t.column :session_id,   :integer
      t.column :day,          :date
      t.column :note,         :text
    end
  end

  def self.down
    drop_table :session_off_days
  end
end
