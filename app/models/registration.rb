class Registration < ActiveRecord::Base
  belongs_to :school
  belongs_to :session
  belongs_to :student
  has_many :lessons, :order => "time ASC"
  has_many :registered_days, :dependent => :destroy
  has_many :registered_dates, :dependent => :destroy
  has_many :registered_options, :dependent => :destroy

  def count_registered_days(week_no)
    week_start = self.session.first - self.session.first.wday
    while(week_no > 1)
      week_start += 7
      week_no -= 1
    end
    week_end = week_start + 6
    rs = self.registered_dates.find(:all, :conditions => ["date >= ? AND date <= ?", week_start, week_end])
    counter = [0,0,0,0,0,0,0]
    rs.each do |r|
      counter[r.date.wday] = 1
    end
    return counter.sum
  end

end
