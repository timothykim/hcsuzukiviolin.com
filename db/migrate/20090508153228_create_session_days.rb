class CreateSessionDays < ActiveRecord::Migration
  def self.up
    create_table :session_days do |t|
      t.column :session_id,   :integer
      t.column :date,          :date
      t.column :offday,       :boolean
      t.column :group,        :boolean
      t.column :note,         :text
    end
  end

  def self.down
    drop_table :session_days
  end
end
