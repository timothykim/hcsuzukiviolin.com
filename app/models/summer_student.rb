class SummerStudent < ActiveRecord::Base
  belongs_to      :summer_school
  has_many        :summer_student_schedule
end