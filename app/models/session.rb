class Session < ActiveRecord::Base
  has_many :weekly_availablities, :dependent => :destroy
  has_many :session_days, :dependent => :destroy
  has_many :registration_options, :dependent => :destroy
  has_many :registrations, :order => "created_at DESC"
  has_many :registered_dates, :through => :registrations
  has_many :students, :through => :registrations
  has_many :lessons, :through => :registrations, :order => "time ASC"
  
  DAY_TYPE = 0
  DATE_TYPE = 1
  
  def to_s
    self.name
  end

  def is_offday?(today)
    d = self.session_days.find_by_date(today)
    return true if d.nil?
    return d.offday
  end

  def find_all_registered_dates_in(start)
    done = start + (30 * 60) # 30 minute interval
    today = Date.parse(start.strftime("%Y/%m/%d"))
    return_array = []
    self.registered_dates.find(:all, :conditions => 
                               ["start IS NOT NULL AND " +
                                "'end' IS NOT NULL AND " +
                                "start >= ? AND " +
                                "start < ? AND " +
                                "date = ?",
                                start, done, today])
  end

  def sanitize_data
    #get rid of duplicate lessons
    sql = <<SQL
DELETE
FROM 	lessons
WHERE 	id NOT IN
	(SELECT 	MAX(dup.id)
        FROM   		lessons As dup
        GROUP BY 	dup.registration_id, dup.time, dup.is_recurring, dup.duration)
SQL
    
    #get rid of out of scope lessons
    self.lessons.each do |l|
      if l.time.hour < 7 or l.time.hour > 21
        l.destroy
      end

      if l.time < self.first or l.time > self.last
        l.destroy
      end
    end
  end
end
