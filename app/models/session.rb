class Session < ActiveRecord::Base
  has_many :weekly_availablities, :dependent => :destroy
  has_many :session_days, :dependent => :destroy
  has_many :registration_options, :dependent => :destroy
  has_many :registrations, :order => "created_at DESC"
  has_many :registered_dates, :through => :registrations
  has_many :registered_days, :through => :registrations
  has_many :students, :through => :registrations, :order => "last_name ASC"
  has_many :lessons, :through => :registrations, :order => "time ASC"
  has_many :pricings
  
  DAY_TYPE = 0
  DATE_TYPE = 1
  
  def to_s
    self.name
  end

  def Session.current
    Session.find(:first, :conditions => ["is_active = ?", true], :order => "first DESC");
  end

  def parents
    p = []
    users = User.find(:all)
    users.each do |u|
      u.registrations.each do |r|
        if r.session_id == self.id
          p.push(u)
          break
        end
      end
    end
    return p.sort {|x,y| x.lastname <=> y.lastname }
  end

  def is_offday?(today)
    d = self.session_days.find_by_date(today)
    return true if d.nil?
    return d.offday
  end

  def is_groupday?(today)
    d = self.session_days.find_by_date(today)
    return false if d.nil?
    return d.group
  end

  def groups
    return self.session_days.select{|d| d.group}.sort{|a,b| a.date<=>b.date}
  end

  def get_note(day)
    d = self.session_days.find_by_date(day)
    return "" if d.nil?
    return d.note
  end

  def week(week_no)
    monday = (self.first.next_week - 7) + ((week_no - 1) * 7)
    saturday = monday + 6
    return monday, saturday
  end

  def all_lessons_in_week(week_no)
    monday, saturday = self.week(week_no)
    self.lessons.find(:all, :conditions => { :time => monday..saturday })
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
