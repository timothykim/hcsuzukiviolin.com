class CreateAttendences < ActiveRecord::Migration
  def self.up
    create_table :attendences do |t|
      t.column :student_id,   :integer
      t.column :date,         :date
      t.column :attendence,   :string
      t.timestamps
    end
  end

  def self.down
    drop_table :attendences
  end
end
