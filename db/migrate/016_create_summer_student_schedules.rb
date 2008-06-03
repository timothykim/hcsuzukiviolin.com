class CreateSummerStudentSchedules < ActiveRecord::Migration
  def self.up
    create_table :summer_student_schedules do |t|
      t.column :summer_student_id, :integer
      t.column :begin, :datetime 
      t.column :end, :datetime
      t.column :selected, :datetime
    end
  end

  def self.down
    drop_table :summer_student_schedules
  end
end
