class CreateParentStudentRelationship < ActiveRecord::Migration
  def self.up
    create_table :students_users do |t|
      t.column :user_id,       :integer
      t.column :student_id,    :integer
    end
  end

  def self.down
    drop_table :students_users
  end
end
