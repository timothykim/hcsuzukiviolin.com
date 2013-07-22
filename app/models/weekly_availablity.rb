class WeeklyAvailablity < ActiveRecord::Base
  belongs_to :session
  belongs_to :school
  
  def to_s
    self.start.strftime("%I:%M%p") + "-" + self.end.strftime("%I:%M%p")
  end
end
