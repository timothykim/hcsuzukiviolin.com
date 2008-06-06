class SummerStudentSchedule < ActiveRecord::Base
  belongs_to  :summer_student
  
  def to_s
    self.begin.strftime("%I:%M%p") + "-" + self.end.strftime("%I:%M%p")
  end


end
