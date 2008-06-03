class SummerStudentColumnEdit < ActiveRecord::Migration
  def self.up
    rename_column(:summer_students, :school_id, :summer_school_id)
  end

  def self.down
    rename_column(:summer_students, :summer_school_id, :school_id)
  end
end
