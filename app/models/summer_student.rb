class SummerStudent < ActiveRecord::Base
  has_one         :summer_school
  has_many        :summer_student_schedule
end
